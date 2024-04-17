<script>
 import {Input, Label, P, Spinner } from 'flowbite-svelte' 
 import {appStatusInfo, setAppStatusError} from '../store'
 const {url, pages, id} = $appStatusInfo

 let answer = ''
 let loading = false

 const numOfImagesToShow = Math.min(pages, 4)
 const images = Array.from({length: numOfImagesToShow}, (_, i) =>{
 const page = i + 1
  return url
  .replace('/upload/', `/upload/w_500,h_640,c_fill,pg_${page}/`)
  .replace('.pdf', '.jpg')
 })

 const handleSubmit = async () =>{
    event.preventDefault()

    loading = true
    const question = event.target.question.value

  try{
    const res = await fetch("api/ask", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        question:"De que treta este documento?"
      }),
   })
  
  if (!res.ok){
    loading = false
      console.log('Error asking question');
      return
   }
   
    const {answer: apiAnswer} = await res.json()
    answer = apiAnswer
  } catch(e){
    setAppStatusError()
  } finally{
   loading = false
  }
 }
</script>

<div class='grid grid-cols-4 gap-2'> 
  {#each images as image }
  <img src={image}  alt="PDF page" class="rounded w-full h-auto aspect-[400/540]">
  {/each}
</div>

 <form on:submit={handleSubmit}>
  <Label for="question" class="block mb-2">Deja aqui tus preguntas</Label>
  <Input id="question" required placeholder="De que trata este documento?">
  </Input>
</form>

{#if loading}
  <div class="flex justify-center items-center flex-col gap-y-2">
    <Spinner></Spinner>
    <p class="opacity-75"> Esperado respuesta</p>
  </div>
{/if}

{#if answer}
  <div class=mt-8>
    <p class="font-medium">Respuesta:</p>
    <p>{answer}</p>
  </div>
{/if}