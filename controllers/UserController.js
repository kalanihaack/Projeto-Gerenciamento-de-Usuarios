class UserController {

    constructor(formId, tableId) {

        this.formEl = document.getElementById(formId)
        this.tableEl = document.getElementById(tableId)

        this.onSubmit()

    }

    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault()

            let values = this.getValues()

            this.getPhoto().then((content)=>{

                values.photo = content
                this.addLine(values)
                

            }, (e)=>{
                console.error(e)

            }) 
        }) //funcao para fazer o click que envia o formulario

    }

    getPhoto() {

        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader()

            let elements = Array.from(this.formEl.elements).filter(item => {

                if (item.name === "photo") {
                    return item  //obriga a adicao de uma foto
                }
            })

            let file = elements[0].files[0]

            fileReader.onload = () => {
                resolve(fileReader.result)
            }

            fileReader.onerror = (e)=>{
                reject(e) //retorna erro a partir do promise
            }
            
            
            if(file) {
                fileReader.readAsDataURL(file)  //para nao retornar erro no console
            } else {
                resolve('dist/img/boxed-bg.jpg')
            }
        })

        }



    getValues() {

        let user = {}

        Array.from(this.formEl.elements).forEach(function (field, index) { //usando array.from para substituir o spread (transformar em array)

            if (field.name == "gender") {

                if (field.checked) {
                    user[field.name] = field.value
                }

            } else if (field.name == "admin") {
                user [field.name] = field.checked
            }else {
                user[field.name] = field.value
            }

        })
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin)
    } // foreach para pegar as informacoes escrita pelo usuario nas boxes


    addLine(dataUser) {

        let tr = document.createElement("tr")

        tr.innerHTML =
        `
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
                    <td>${dataUser.birth}</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td> 
         `

         this.tableEl.appendChild(tr) //permite adicionar mais de um usuario na listagem, e retorna se o admin é sim ou nao
    }
}