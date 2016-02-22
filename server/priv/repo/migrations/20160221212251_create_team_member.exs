defmodule TrelloBurndown.Repo.Migrations.CreateTeamMember do
  use Ecto.Migration

  def change do
    create table(:team_members) do
      add :velocity, :float
      add :trello_id, :string
      add :team_id, :integer
      add :admin, :boolean, null: false, default: false

      timestamps
    end

    index :team_members, [:trello_id], unique: true
  end
end
