# Import all the models so that Base has them before being imported by Alembic
from app.core.database import Base  # noqa
from app.models.user import User  # noqa
from app.models.food_item import FoodItem  # noqa
from app.models.sales import SalesRecord  # noqa
from app.models.waste import WasteLog  # noqa
from app.models.prediction import DemandPrediction  # noqa
from app.models.prep_schedule import PreparationBatch  # noqa
from app.models.notification import Notification  # noqa
from app.models.restaurant import RestaurantConfig  # noqa
