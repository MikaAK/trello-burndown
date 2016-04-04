defmodule TrelloBurndown.Repo.Migrations.AddAuthTokenToSprints do
  use Ecto.Migration

  def change do
    alter table(:sprints) do
      add :auth_token, :string
    end
  end
end
