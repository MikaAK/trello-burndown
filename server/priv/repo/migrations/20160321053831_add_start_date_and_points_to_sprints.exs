defmodule TrelloBurndown.Repo.Migrations.AddStartDateAndPointsToSprints do
  use Ecto.Migration

  def change do
    alter table(:sprints) do
      add :points, :integer
      add :start_date, :date
    end
  end
end
