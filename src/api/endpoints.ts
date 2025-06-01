export const CarByIdEndpoint = {
    index: (id:number) => `cars/${id}`,
};
export const hostByIdEndpoint = {
    index: (id:number) => `cars/${id}/host`
}
export const renterByIdEndpoint = {
    index: 'auth/profile'
}
export const ordenDePago = {
    index: 'paymentOrder'
}