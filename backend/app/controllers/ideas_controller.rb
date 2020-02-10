class IdeasController < ApplicationController
    def index
        ideas = Idea.all
        render json: ideas, status: 201
    end
end
