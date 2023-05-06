import './Notes.css'

function Notes(){

    let getDataURL = 'https://revesion-m11-backend.vercel.app/getNote';

    let addURL = 'https://revesion-m11-backend.vercel.app/createNote'

    let container = document.getElementsByClassName('notes');
    getData(getDataURL);

    async function getData(url){
        let res = await fetch(url);
        res = await res.json();
        console.log(res);
        render(container[0],res);
    }

    function render(container,data){
        container.innerHTML = '';
        if(data.length === 0){
            let h1 = document.createElement('h1');
            h1.innerText = 'No notes to display...'
            container.append(h1);
        }
        document.getElementById('view').innerText = `View Notes ${data.length || ""}`
        for(let elem of data){
            let div = document.createElement('div');
            let input = document.createElement('input');
            input.value = elem.title;
            input.disabled = true
            let textarea = document.createElement('textarea');
            textarea.value = elem.body;
            textarea.disabled = true;
            let date = document.createElement('p');
            date.innerText = elem.date;
            date.disabled = true;
            let del = document.createElement('button');
            del.innerText = 'Delete'
            del.className = elem._id;
            del.addEventListener('click',deleteNote);
            let edit = document.createElement('button');
            edit.innerText = 'Edit'
            edit.className = elem._id;
            edit.addEventListener('click',editNote);
            div.append(input,textarea,date,edit,del);
            container.append(div);
        }
    }

    async function deleteNote(event){
        event.srcElement.innerText = 'Working';
        let url = `https://revesion-m11-backend.vercel.app/delete/${event.srcElement.className}`
        let res = await fetch(url,{
            method:'DELETE'
        })
        console.log(res);
        getData(getDataURL);
    }

    async function editNote(event){

        let url = `https://revesion-m11-backend.vercel.app/edit/${event.srcElement.className}`

        let inputs = event.srcElement.parentNode.childNodes;

        let arr = [...inputs];
        
        arr = arr.filter(elem => elem.value);
        console.log(inputs);
        
        if(event.srcElement.innerText == 'Save'){
            // getData(getDataURL);
            event.srcElement.innerText = 'Working...'
            for(let elem of arr){
                elem.disabled = true;
                elem.style.borderColor = 'transparent'
            }

            let payload = {
                title: arr[0].value,
                body: arr[1].value
            }

            payload.date = new Date().toUTCString();

            console.log(new Date().toUTCString(),payload);

            let res = await fetch(url,{
                method:'PATCH',
                headers:{
                    'content-type':'application/json'
                },
                body: JSON.stringify(payload)
            })

            console.log(res);

            getData(getDataURL);
            
            event.srcElement.innerText = 'Edit';

        }
        else{
            for(let elem of arr){
                elem.disabled = false;
                elem.style.borderColor = 'white'
            }
            event.srcElement.innerText = 'Save';
        }
        
    }

    async function addNote(event){
        event.preventDefault();
        let title = document.getElementById('title').value;
        let body = document.getElementById('body').value;
        let date = new Date().toDateString();

        let payload = {
            title, body, date
        }

        let res = await fetch(addURL,{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(payload)
        })

        console.log(res);

        getData(getDataURL);

        document.getElementById('title').value = '';
        document.getElementById('body').value = '';
    }

    return(
        <div className="main">
            <div id='form' onSubmit={addNote}>
                <h1>New Note</h1>
                <form>
                    <p>Title</p>
                    <input type="text" id="title" required/>
                    <p>Body</p>
                    <textarea id="body" cols="30" rows="10" required></textarea>
                    <button type='submit'>Create</button>
                </form>
            </div>
            <div className='view' >
                <h1 id='view' >View Notes</h1>
                <div className='notes'>
                    <h1 id='Loading' >Loading...</h1>
                </div>
            </div>
        </div>
    )
}

export default Notes;