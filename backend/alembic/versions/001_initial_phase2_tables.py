"""001_initial_phase2_tables

Revision ID: 001_initial_phase2_tables
Revises:
Create Date: 2026-10-08 19:54:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_phase2_tables'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False, server_default='Restaurant Manager'),
        sa.Column('branch_id', sa.String(length=50), nullable=False, server_default='HYD-BLR-04'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. restaurant_config table
    op.create_table(
        'restaurant_config',
        sa.Column('branch_id', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('cuisine', sa.String(length=100), nullable=True),
        sa.Column('capacity_seats', sa.Integer(), nullable=False, server_default='120'),
        sa.Column('avg_daily_orders', sa.Integer(), nullable=False, server_default='540'),
        sa.Column('ai_prep_safety_buffer_percent', sa.Float(), nullable=False, server_default='6.0'),
        sa.Column('waste_threshold_alert_kg', sa.Float(), nullable=False, server_default='10.0'),
        sa.Column('currency_symbol', sa.String(length=10), nullable=False, server_default='₹'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('branch_id')
    )

    # 3. food_items table
    op.create_table(
        'food_items',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('cost', sa.Float(), nullable=False),
        sa.Column('avg_daily_sales', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('current_stock', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('unit', sa.String(length=30), nullable=False, server_default='portions'),
        sa.Column('lead_time_hours', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('shelf_life_days', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('ai_optimized', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_food_items_category'), 'food_items', ['category'], unique=False)
    op.create_index(op.f('ix_food_items_name'), 'food_items', ['name'], unique=False)

    # 4. sales_records table
    op.create_table(
        'sales_records',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('food_item_id', sa.String(length=36), nullable=True),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('quantity_sold', sa.Integer(), nullable=False),
        sa.Column('revenue', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['food_item_id'], ['food_items.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sales_records_date'), 'sales_records', ['date'], unique=False)
    op.create_index(op.f('ix_sales_records_food_item_id'), 'sales_records', ['food_item_id'], unique=False)

    # 5. waste_logs table
    op.create_table(
        'waste_logs',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('food_item_id', sa.String(length=36), nullable=True),
        sa.Column('item_name', sa.String(length=100), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('time', sa.String(length=10), nullable=True),
        sa.Column('quantity', sa.Float(), nullable=False),
        sa.Column('unit', sa.String(length=30), nullable=False, server_default='portions'),
        sa.Column('reason', sa.String(length=100), nullable=False),
        sa.Column('financial_loss', sa.Float(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['food_item_id'], ['food_items.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_waste_logs_date'), 'waste_logs', ['date'], unique=False)
    op.create_index(op.f('ix_waste_logs_food_item_id'), 'waste_logs', ['food_item_id'], unique=False)
    op.create_index(op.f('ix_waste_logs_reason'), 'waste_logs', ['reason'], unique=False)

    # 6. demand_predictions table
    op.create_table(
        'demand_predictions',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('food_item_id', sa.String(length=36), nullable=True),
        sa.Column('prediction_date', sa.Date(), nullable=False),
        sa.Column('day_of_week', sa.String(length=20), nullable=False),
        sa.Column('predicted_demand', sa.Integer(), nullable=False),
        sa.Column('recommended_prep', sa.Integer(), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('expected_waste', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('shortage_risk', sa.String(length=20), nullable=False, server_default='Low'),
        sa.Column('weather_condition', sa.String(length=50), nullable=True),
        sa.Column('rain_probability', sa.Integer(), nullable=True),
        sa.Column('factors', sa.JSON(), nullable=False),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['food_item_id'], ['food_items.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_demand_predictions_food_item_id'), 'demand_predictions', ['food_item_id'], unique=False)
    op.create_index(op.f('ix_demand_predictions_prediction_date'), 'demand_predictions', ['prediction_date'], unique=False)

    # 7. preparation_batches table
    op.create_table(
        'preparation_batches',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('food_item_id', sa.String(length=36), nullable=True),
        sa.Column('batch_size', sa.Integer(), nullable=False),
        sa.Column('prepare_time', sa.String(length=20), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=False, server_default='Scheduled'),
        sa.Column('station', sa.String(length=50), nullable=False, server_default='Station A'),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['food_item_id'], ['food_items.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_preparation_batches_date'), 'preparation_batches', ['date'], unique=False)
    op.create_index(op.f('ix_preparation_batches_food_item_id'), 'preparation_batches', ['food_item_id'], unique=False)

    # 8. notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('type', sa.String(length=30), nullable=False),
        sa.Column('priority', sa.String(length=20), nullable=False),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('time_label', sa.String(length=50), nullable=True),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.Column('recommended_action', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notifications_priority'), 'notifications', ['priority'], unique=False)
    op.create_index(op.f('ix_notifications_type'), 'notifications', ['type'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_notifications_type'), table_name='notifications')
    op.drop_index(op.f('ix_notifications_priority'), table_name='notifications')
    op.drop_table('notifications')
    op.drop_index(op.f('ix_preparation_batches_food_item_id'), table_name='preparation_batches')
    op.drop_index(op.f('ix_preparation_batches_date'), table_name='preparation_batches')
    op.drop_table('preparation_batches')
    op.drop_index(op.f('ix_demand_predictions_prediction_date'), table_name='demand_predictions')
    op.drop_index(op.f('ix_demand_predictions_food_item_id'), table_name='demand_predictions')
    op.drop_table('demand_predictions')
    op.drop_index(op.f('ix_waste_logs_reason'), table_name='waste_logs')
    op.drop_index(op.f('ix_waste_logs_food_item_id'), table_name='waste_logs')
    op.drop_index(op.f('ix_waste_logs_date'), table_name='waste_logs')
    op.drop_table('waste_logs')
    op.drop_index(op.f('ix_sales_records_food_item_id'), table_name='sales_records')
    op.drop_index(op.f('ix_sales_records_date'), table_name='sales_records')
    op.drop_table('sales_records')
    op.drop_index(op.f('ix_food_items_name'), table_name='food_items')
    op.drop_index(op.f('ix_food_items_category'), table_name='food_items')
    op.drop_table('food_items')
    op.drop_table('restaurant_config')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
