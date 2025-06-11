import pytest
from httpx import AsyncClient, ASGITransport
from dotenv import load_dotenv
load_dotenv(dotenv_path="env/tests.env", override=True)
from backend.main import app 

@pytest.mark.asyncio
async def test_liveness():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/health/live")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_readiness():
    class FakeSession:
        async def execute(self, stmt):
            assert str(stmt) == "SELECT 1"
            class Result:
                def scalar(self): return 1
            return Result()

    async def fake_get_db():
        yield FakeSession()

    # ✅ Override the get_db dependency
    app.dependency_overrides = {}
    from backend.db import get_db  # wherever get_db is defined
    app.dependency_overrides[get_db] = fake_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/health/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ready"}

    # ✅ Clean up
    app.dependency_overrides.clear()
