import axios from 'axios';
export const fetchEmails = async ({ queryKey }) => {
    const [, page] = queryKey; // Extract the page number from queryKey
    const { data } = await axios.get(`https://flipkart-email-mock.now.sh/?page=${page}`);
    return data;
  };
export const fetchAllEmails = async () => {
  
    const { data } = await axios.get(`https://flipkart-email-mock.now.sh/ `);
    return data;
  };


  export const getEmailById = async({ queryKey})=>{
    const [, id] = queryKey; 
    const { data } = await axios.get(`https://flipkart-email-mock.now.sh/?id=${id}`);
    return data;
  }