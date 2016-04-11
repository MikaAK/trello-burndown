defmodule TrelloBurndown.Repo.Migrations.RemoveDateFromSprintSnapshot do
  use Ecto.Migration

  def change do
    alter table(:sprint_snapshots) do
      remove :date
    end
  end
end
