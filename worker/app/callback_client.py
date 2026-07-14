"""Gọi internal callback API của backend (started/completed/failed).

Xem done/backend/api_spec.md §13.
"""
import requests

from app import config

_HEADERS = {"X-Worker-Token": config.WORKER_SHARED_SECRET}


def _url(job_id: int, action: str) -> str:
    return f"{config.BACKEND_INTERNAL_BASE_URL}/conversions/{job_id}/{action}"


def notify_started(job_id: int, started_at: str) -> None:
    response = requests.post(
        _url(job_id, "started"),
        json={"workerId": config.WORKER_ID, "startedAt": started_at},
        headers=_HEADERS,
        timeout=10,
    )
    response.raise_for_status()


def notify_completed(job_id: int, payload: dict) -> None:
    response = requests.post(
        _url(job_id, "completed"),
        json=payload,
        headers=_HEADERS,
        timeout=30,
    )
    response.raise_for_status()


def notify_failed(job_id: int, payload: dict) -> None:
    response = requests.post(
        _url(job_id, "failed"),
        json=payload,
        headers=_HEADERS,
        timeout=10,
    )
    response.raise_for_status()