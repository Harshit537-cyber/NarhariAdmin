import apiClient from "../Interceptor/apiClient"


export const getCommissionPartners=()=>{
    return apiClient.get('/admin/commission/partners/all')
}



export const getAllComissions=()=>{
    return apiClient.get('/admin/commission/all-commissions')
}


export const getCommsionById=(id)=>{
    return apiClient.get(`/admin/commission/${id}`)
}


export const updateCommission=(id, data)=>{
    return apiClient.patch(`/admin/commission/update-commission/${id}`,data)
}



export const deleteCommission=(id)=>{
    return apiClient.delete(`/admin/commission/delete/${id}`)
}


export const setCommission=( data)=>{
    return apiClient.post(`/admin/commission/set-commision`,data)
}


