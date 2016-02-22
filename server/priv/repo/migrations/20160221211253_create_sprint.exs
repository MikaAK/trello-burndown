defmodule TrelloBurndown.Repo.Migrations.CreateSprint do
  use Ecto.Migration

  def change do
    create table(:sprints) do
      add :board_id, :string
      add :sprint_name, :string
      add :point_total, :integer
      add :team_id, :integer
      add :holidays, {:array, :integer}

      timestamps
    end

  end
end
