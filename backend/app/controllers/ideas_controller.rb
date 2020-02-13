class IdeasController < ApplicationController
    def index
        ideas = Idea.all
        render json: ideas, each_serializer: IdeaCardSerializer, status: 201
    end

    def create
        idea = Idea.create(idea_params)
        params["tags"].split(",").each do |tag_name|
            tag = Tag.find_by(name: tag_name)
            if !tag
                tag = Tag.create(name: tag_name)
            end
            IdeaTag.create(tag: tag, idea: idea)
        end
        render json: idea, each_serializer: IdeaCardSerializer, status: 201
    end

    def show
        idea = Idea.find(params[:id])
        render json: idea, serializer: IdeaDetailSerializer, status: 201
    end

    def update
        idea = Idea.find(params[:id])
        idea.update(idea_params)
        render json: idea, serializer: IdeaDetailSerializer, status: 201
    end

    private
    def idea_params
        params.require(:idea).permit(:user_id, :title, :description, :image)
    end
end
