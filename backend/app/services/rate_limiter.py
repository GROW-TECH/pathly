from datetime import datetime, timedelta
from typing import Dict, Tuple

class LoginRateLimiter:
    def __init__(self, max_attempts: int = 5, window_minutes: int = 5):
        self.max_attempts = max_attempts
        self.window_seconds = window_minutes * 60
        # key -> (attempt_count, first_attempt_timestamp)
        self._attempts: Dict[str, Tuple[int, datetime]] = {}

    def is_rate_limited(self, identifier: str) -> bool:
        now = datetime.utcnow()
        if identifier not in self._attempts:
            return False

        count, first_attempt = self._attempts[identifier]
        if (now - first_attempt).total_seconds() > self.window_seconds:
            # Window expired, reset
            del self._attempts[identifier]
            return False

        return count >= self.max_attempts

    def record_failed_attempt(self, identifier: str) -> None:
        now = datetime.utcnow()
        if identifier not in self._attempts:
            self._attempts[identifier] = (1, now)
        else:
            count, first_attempt = self._attempts[identifier]
            if (now - first_attempt).total_seconds() > self.window_seconds:
                self._attempts[identifier] = (1, now)
            else:
                self._attempts[identifier] = (count + 1, first_attempt)

    def reset_attempts(self, identifier: str) -> None:
        if identifier in self._attempts:
            del self._attempts[identifier]

login_rate_limiter = LoginRateLimiter(max_attempts=5, window_minutes=5)

