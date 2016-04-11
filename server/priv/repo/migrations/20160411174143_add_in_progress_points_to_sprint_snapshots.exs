defmodule TrelloBurndown.Repo.Migrations.AddInProgressPointsToSprintSnapshots do
  use Ecto.Migration

  def change do
    alter table(:sprint_snapshots) do
      add :in_progress_points, :integer
    end
  end
end
