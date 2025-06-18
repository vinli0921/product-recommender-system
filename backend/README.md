# Backend for Product Recommendation System Kickstart


## How to Use

This section guides you through setting up and running the backend services for the product recommendation system.

### Prerequisites

Ensure you have the following installed on your system:

*   **Podman**: Container runtime for running the application and its dependencies
*   **Python 3.12+**: Required for building the container image
### Deployment with Podman

1. **Clone the repository**:
    First, clone the project repository to your local machine and navigate into the `backend` directory:
    ```bash
    git clone <repository_url>
    cd <repository_name>/backend
    ```

2. **Build the container image**:
    Build the container image using the provided Dockerfile:
    ```bash
    podman build -t product-recommender-backend .
    ```

3. **Start the services using Podman Compose**:
    The system uses Kafka for event streaming and requires a feature store. Start all services using podman-compose:
    ```bash
    podman run -p 8000:8000 product-recommender-backend
    ```

5. **Access the application**:
    The API will be accessible at `http://localhost:8000`