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

async def run_with_client(test_func):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        return await test_func(ac)  

@pytest.mark.asyncio
async def test_liveness():
    async def inner(client):
        response = await client.get("/health/live")
        assert response.status_code == 200

    await run_with_client(inner)


class FakeSuccessSession:
    async def execute(self, stmt):
        assert str(stmt) == "SELECT 1"
        class Result:
            def scalar(self): return 1
        return Result()

@pytest.mark.asyncio
async def test_readiness_success(override_get_db):
    override_get_db(FakeSuccessSession)

    async def inner(client):
        response = await client.get("/health/ready")
        assert response.status_code == 200
        assert response.json() == {"status": "ready"}

    await run_with_client(inner)


class FakeFailureSession:
    async def execute(self, stmt):
        raise Exception("DB failure")

@pytest.mark.asyncio
async def test_readiness_failure(override_get_db):
    override_get_db(FakeFailureSession)

    async def inner(client):
        response = await client.get("/health/ready")
        assert response.status_code == 503

    await run_with_client(inner)
