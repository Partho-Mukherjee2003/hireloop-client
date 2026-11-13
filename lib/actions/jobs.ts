import  {JobInput} from '@/app/dashboard/recruiter/manage-jobs/add-jobs/page'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export  const createJob = async (data:JobInput) =>{
  const res = await fetch(`${BASE_URL}/jobs`,{
    method:"POST",
    headers:{
        'content-type' : 'application/json'
    },
    body:JSON.stringify(data),
  })
  return res.json();
}
