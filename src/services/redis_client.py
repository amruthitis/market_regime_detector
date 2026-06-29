import redis

from src.config import(
    REDIS_HOST,
    REDIS_PASSWORD,
    REDIS_PORT,
    REDIS_SSL
)

redis_client = redis.Redis(
    host = REDIS_HOST,
    port = REDIS_PORT,
    password= REDIS_PASSWORD,
    ssl = REDIS_SSL,
    decode_responses = True
)