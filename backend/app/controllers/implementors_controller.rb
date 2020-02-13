class ImplementorsController < ApplicationController
    def create
        params = implementors_params
        implementor = Implementor.find_by(user_id: params["user_id"], idea_id: params["idea_id"])
        if(!implementor)
            implementor = Implementor.create(params)
            render json: implementor, status: 201
        else
            render status: 412
        end
    end

    def destroy
        implementor = Implementor.find(params["id"])
        if(implementor)
            implementor.destroy
            render json: true, status: 201
        else
            render status: 412
        end
    end

    private
    def implementors_params
        params.require(:implementor).permit(:user_id, :idea_id)
    end
end