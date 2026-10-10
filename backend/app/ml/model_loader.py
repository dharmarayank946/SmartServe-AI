import os
from typing import Optional
from sqlalchemy.orm import Session

from app.ml.demand_model import DemandPredictionModel
from app.ml.train_model import MODEL_SAVE_PATH, train_and_save_model

_cached_model: Optional[DemandPredictionModel] = None


def get_demand_model(db: Optional[Session] = None, force_reload: bool = False) -> DemandPredictionModel:
    """
    Load and return singleton trained DemandPredictionModel instance.
    Does NOT retrain or reload from disk on every request.
    """
    global _cached_model

    if _cached_model is not None and _cached_model.is_trained and not force_reload:
        return _cached_model

    model = DemandPredictionModel()

    # Attempt to load existing model artifact from disk
    if os.path.exists(MODEL_SAVE_PATH) and not force_reload:
        loaded = model.load(MODEL_SAVE_PATH)
        if loaded and model.is_trained:
            _cached_model = model
            return _cached_model

    # If model is not loaded and DB session is provided, attempt training
    if db is not None:
        trained_model, success, _ = train_and_save_model(db, save_path=MODEL_SAVE_PATH)
        if success and trained_model.is_trained:
            _cached_model = trained_model
            return _cached_model

    _cached_model = model
    return _cached_model


def reset_cached_model():
    """Reset cached model instance for testing."""
    global _cached_model
    _cached_model = None
