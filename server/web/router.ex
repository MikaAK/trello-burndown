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
    resources "/sprint-snapshots", SprintSnapshotController, only: [:show, :index]
    resources "/sprint-team-member-snapshots", SprintTeamMemberSnapshotController, only: [:show, :index]

    scope "/trello" do
      resources "/boards", TrelloBoardController, only: [:show] do
        get "/labels", TrelloBoardController, :labels_index, as: :board_labels
      end

    end

    forward "/", ApiController, :not_found
  end

  scope "/", TrelloBurndown do
    pipe_through :browser # Use the default browser stack

    get "*path", PageController, :index
  end
end
