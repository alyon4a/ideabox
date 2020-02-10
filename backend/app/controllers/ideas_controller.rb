class IdeasController < ApplicationController
    def index
        ideas = Idea.all
        render json: ideas, status: 201
    end

    def create
        idea = Idea.create(idea_params)
        render json: idea, status: 201
    end

    private
    def idea_params
        params.require(:idea).permit(:user_id, :title, :description, :image)
    end
end
