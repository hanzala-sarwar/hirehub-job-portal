 
import { setSingleJob } from '@/redux/jobSlice'
 
 
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetJobById = (jobId) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                
                const res = await axios.get(`/api/job/getjobbyid/${jobId}`,{withCredentials:true});
                console.log(res.data.job);
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                // console.log(error);
            }
        }
        fetchSingleJob();
    },[jobId, dispatch])
}

export default useGetJobById