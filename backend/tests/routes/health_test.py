import pytest
from httpx import AsyncClient, ASGITransport
from dotenv import load_dotenv
load_dotenv(dotenv_path="env/tests.env", override=True)
from backend.main import app
from backend.db import get_db


@pytest.fixture
def override_get_db():
    def _make_override(session_cls):
        async def fake_get_db():
            yield session_cls()
        app.dependency_overrides[get_db] = fake_get_db
    yield _make_override
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_liveness():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/health/live")
    assert response.status_code == 200


class FakeSuccessSession:
    async def execute(self, stmt):
        assert str(stmt) == "SELECT 1"
        class Result:
            def scalar(self): return 1
        return Result()

@pytest.mark.asyncio
async def test_readiness_success(override_get_db):
    override_get_db(FakeSuccessSession)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/health/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ready"}


class FakeFailureSession:
    async def execute(self, stmt):
        raise Exception("DB failure")

@pytest.mark.asyncio
async def test_readiness_failure(override_get_db):
    override_get_db(FakeFailureSession)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/health/ready")

    assert response.status_code == 503
