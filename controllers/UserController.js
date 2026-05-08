class UserController {

    constructor(formIdCreate, formIdUpdate, tableId) {

        this.formEl = document.getElementById(formIdCreate)
        this.formUpdateEl = document.getElementById(formIdUpdate)
        this.tableEl = document.getElementById(tableId)

        this.onSubmit()
        this.onEdit()

    }

    onEdit() {
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
            this.showPanelCreate() //quando apertar no botao de cancelar no formulario de editar, ele retorna para o formulario de novo usuario
        })

        this.formUpdateEl.addEventListener("submit", event => { 

            event.preventDefault()

            let btn = this.formUpdateEl.querySelector("[type=submit]")

            btn.disabled = true

            let values = this.getValues(this.formUpdateEl) //quando o usuario apertar em editar, trocar as informacoes, e apertar em salvar, ele envia um novo json

            let index = this.formUpdateEl.dataset.trIndex

            let tr = this.tableEl.rows[index]

            let userOld = JSON.parse(tr.dataset.user)

            let result = Object.assign({}, userOld, values)

            this.getPhoto(this.formUpdateEl).then((content) => {

                if(!values.photo) {
                    result._photo = userOld._photo
                } else {
                    result._photo = content //se o resultado da foto for vazio no formulario de edicao, ele usa a foto antiga
                }

                tr.dataset.user = JSON.stringify(result)

                tr.innerHTML =
                    `
                    <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${result._name}</td>
                    <td>${result._email}</td>
                    <td>${(result._admin) ? "Sim" : "Não"}</td>
                    <td>${Utils.dateFormat(result._register)}</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-xs btn-edit btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td> 
         `

                this.addEventsTr(tr)

                this.updateCount()


                this.formEl.reset()
                btn.disabled = false //quando faz o envio do formulario, ele limpa os campos e reabilita o botao para submit

                this.showPanelCreate(this.formUpdateEl)


            }, (e) => {
                console.error(e)

            })
        }) //funcao para fazer o click que envia o formulario

    }

onSubmit() {

    this.formEl.addEventListener("submit", event => {

        event.preventDefault()

        let btn = this.formEl.querySelector("[type=submit]")

        btn.disabled = true

        let values = this.getValues(this.formEl)

        this.getPhoto(this.formEl).then((content) => {

            values.photo = content
            this.addLine(values)
            this.formEl.reset()
            btn.disabled = false //quando faz o envio do formulario, ele limpa os campos e reabilita o botao para submit


        }, (e) => {
            console.error(e)

        })
    }) //funcao para fazer o click que envia o formulario

}

getPhoto(formEl) {

    return new Promise((resolve, reject) => {

        let fileReader = new FileReader()

        let elements = Array.from(formEl.elements).filter(item => {

            if (item.name === "photo") {
                return item  //obriga a adicao de uma foto
            }
        })

        let file = elements[0].files[0]

        fileReader.onload = () => {
            resolve(fileReader.result)
        }

        fileReader.onerror = (e) => {
            reject(e) //retorna erro a partir do promise
        }


        if (file) {
            fileReader.readAsDataURL(file)  //para nao retornar erro no console
        } else {
            resolve('dist/img/boxed-bg.jpg')
        }
    })

}



getValues(formEl) {

    let user = {}
    let isValid = true //valida se os valores estao validos

    Array.from(formEl.elements).forEach(function (field, index) { //usando array.from para substituir o spread (transformar em array)

        if (["name", "email", "password"].indexOf(field.name) > -1 && !field.value) { //obriga o preenchimento de nome, email e senha
            field.parentElement.classList.add("has-error")
            isValid = false //se nao passar na validacao, retorna erro e nao deixa avancar
        }

        if (field.name == "gender") {

            if (field.checked) {
                user[field.name] = field.value //retorna qual genero esta marcado
            }

        } else if (field.name == "admin") {
            user[field.name] = field.checked
        } else {
            user[field.name] = field.value //mostra se a box de admin esta marcada ou nao
        }

    })

    if (!isValid) {
        return false
    }

    return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin)
} // foreach para pegar as informacoes escrita pelo usuario nas boxes


addLine(dataUser) {

    let tr = document.createElement("tr")

    tr.dataset.user = JSON.stringify(dataUser)

    tr.innerHTML =
        `
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
                    <td>${Utils.dateFormat(dataUser.register)}</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-xs btn-edit btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td> 
         `

    this.addEventsTr(tr)

    this.tableEl.appendChild(tr) //permite adicionar mais de um usuario na listagem, e retorna se o admin é sim ou nao

    this.updateCount()
}

addEventsTr(tr) {

    tr.querySelector(".btn-edit").addEventListener("click", e => {
        let json = JSON.parse(tr.dataset.user)

        this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex

        for (let name in json) {
            let field = this.formUpdateEl.querySelector("[name= " + name.replace("_", "") + "]")

            if (field) {
                if (field.type == "file") continue

                switch (field.type) {
                    case "file":
                        continue
                        break

                    case "radio":
                        field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]")
                        field.checked = true
                        break

                    case "checkbox":
                        field.checked = json[name]
                        break

                    default:
                        field.value = json[name]
                }

            } //for para quando apertar no botao editar, ele puxar os valores do usuario para edicao
        }

        this.formUpdateEl.querySelector(".photo").src = json._photo

        this.showPanelUpdate()
    }) //quando aperta no botao editar, ele troca o formulario para o de edicao
}

showPanelCreate() {
    document.querySelector("#box-user-create").style.display = "block"
    document.querySelector("#box-user-update").style.display = "none"
} //mostra o painel de criar usuario e esconde o de edicao

showPanelUpdate() {
    document.querySelector("#box-user-create").style.display = "none"
    document.querySelector("#box-user-update").style.display = "block"
} //mostra o painel de edicao e esconde o de criar

updateCount() {

    let numberUsers = 0
    let numberAdmin = 0

    Array.from(this.tableEl.children).forEach(tr => {

        numberUsers++

        let user = JSON.parse(tr.dataset.user)

        if (user._admin) numberAdmin++


    })

    document.querySelector("#number-users").innerHTML = numberUsers
    document.querySelector("#number-users-admin").innerHTML = numberAdmin
}
} //funcao que pega o array e atualiza as tabelas do html (contador de usuarios e administradores)