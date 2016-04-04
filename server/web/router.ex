defmodule TrelloBurndown.Router do
  use TrelloBurndown.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", TrelloBurndown do
    pipe_through :api

    resources "/sprints", SprintController, except: [:new, :edit]
    resources "/team-members", TeamMemberController, except: [:new, :edit]
    resources "/team", TeamController, except: [:new, :edit]
    resources "/sprint-snapshots", SprintSnapshotController, except: [:new, :edit, :create, :update]
    resources "/sprint_team_member_snapshots", SprintTeamMemberSnapshotController, except: [:new, :edit, :create, :update]
  end

  scope "/", TrelloBurndown do
    pipe_through :browser # Use the default browser stack

    # get "/", PageController, :index
    get "*path", PageController, :index
  end
end
