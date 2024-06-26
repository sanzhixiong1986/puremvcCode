/**
 * 模型，只写基础数据
 */
export default class Model {

    private static _intance: Model = new Model();

    private _userBase = null;
    public static getIntance(): Model {
        if (Model._intance == null) {
            Model._intance = new Model();
        }
        return Model._intance;
    }

    //用户的基础数据
    public setUserBase(data) {
        this._userBase = data;
    }

    //获得用户的基础数据
    public getUserBase() {
        return this._userBase;
    }

    //单独设置用户的姓名
    public setUnick(unick) {
        if (this._userBase) {
            this._userBase.unick = unick;
        }
    }

    //单独设置用户的状态
    public setGuest(status) {
        if (this._userBase) {
            this._userBase.is_guest = status;
        }
    }
}
