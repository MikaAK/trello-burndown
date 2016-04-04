defmodule TrelloBurndown.Repo.Migrations.CreateSprintSnapshot do
  use Ecto.Migration

  def change do
    create table(:sprint_snapshots) do
      add :date, :date
      add :points_left, :integer
      add :points_complete, :integer
      add :points_dev_complete, :integer
      add :sprint_id, :integer

      timestamps
    end
  end
end
