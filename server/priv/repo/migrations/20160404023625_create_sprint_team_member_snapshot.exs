defmodule TrelloBurndown.Repo.Migrations.CreateSprintTeamMemberSnapshot do
  use Ecto.Migration

  def change do
    create table(:sprint_team_member_snapshots) do
      add :sprint_snapshot_id, :integer
      add :team_member_id, :integer
      add :points_complete, :integer
      add :points_dev_complete, :integer

      timestamps
    end
  end
end
