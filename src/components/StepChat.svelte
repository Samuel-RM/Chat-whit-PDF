<script>
 import {Input, Label, Spinner } from 'flowbite-svelte' 
 import {appStatusInfo} from '../store'
 const {url, pages, id} = $appStatusInfo

 let loading = false

 const numofImagesToShow = math.main(pages, 4)
 const images = Array.from({length: numofImagesToShow}, (_, i) =>{

 })

 const handleSubmit = () =>{

 }
 
 </script>

 <form on:submit={handleSubmit}>

</form>

<div class="mb-6">
  <Label for="question-input" class="block mb-2">Deja aqui tus preguntas</Label>
  <Input id="question-input"  placeholder="De que trata este documento?">
  </Input>
</div>