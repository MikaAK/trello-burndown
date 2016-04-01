defmodule TrelloBurndown.Repo.Migrations.AddEndDateToSprints do
  use Ecto.Migration

  def change do
    alter table(:sprints) do
      add :end_date, :date
    end
  end
end
