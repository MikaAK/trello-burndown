defmodule TrelloBurndown.Repo.Migrations.ChangeSprintsHolidaysToArrayDate do
  use Ecto.Migration

  def change do
    alter table(:sprints) do
      remove :holidays
    end
  end
end
