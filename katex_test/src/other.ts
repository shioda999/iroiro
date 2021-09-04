export class Other {
    private delete_history_event
    private save_data_to_storage_event
    private load_data_from_storage_event
    private save_data_to_file_event
    private load_data_from_file_event
    constructor() {
        this.create_customEvents()
        this.set_buttonEvents()
    }
    private create_customEvents() {
        this.delete_history_event = new CustomEvent("my_event_delete_history")
        this.save_data_to_storage_event = new CustomEvent("my_event_save_data_to_storage")
        this.load_data_from_storage_event = new CustomEvent("my_event_load_data_from_storage")
        this.save_data_to_file_event = new CustomEvent("my_event_save_data_to_file")
        this.load_data_from_file_event = new CustomEvent("my_event_load_data_from_file")
    }
    private set_buttonEvents() {
        document.getElementById("delete_history").addEventListener("click", this.delete_history)
        document.getElementById("save_data_to_storage").addEventListener("click", this.save_data_to_storage)
        document.getElementById("load_data_from_storage").addEventListener("click", this.load_data_from_storage)
        document.getElementById("save_data_to_file").addEventListener("click", this.save_data_to_file)
        document.getElementById("load_data_from_file").addEventListener("click", this.load_data_from_file)
    }
    private delete_history = () => {
        let ret = window.confirm("編集履歴が削除され、現在非表示のペイントのレイヤーをすべて削除します。\
「戻る」ボタンを押しても、削除されたレイヤーは表示できなくなります。")
        if (ret == false) return
        window.dispatchEvent(this.delete_history_event)
    }
    private save_data_to_storage = () => {
        let ret = window.confirm("レイヤーデータをローカルストレージに保存します。")
        if (ret == false) return
        window.dispatchEvent(this.save_data_to_storage_event)
    }
    private load_data_from_storage = () => {
        window.dispatchEvent(this.load_data_from_storage_event)
        alert("読み込みが完了しました。")
    }
    private save_data_to_file = () => {
        window.dispatchEvent(this.save_data_to_file_event)
    }
    private load_data_from_file = () => {
        window.dispatchEvent(this.load_data_from_file_event)
    }
    public change_mode() {
    }
}