import React from 'react';

const CarAddPage: React.FC = () => {
    return (
        <div>
            <h1>Agregar un Nuevo Vehículo</h1>
            <form>
                <div>
                    <label htmlFor="carModel">Modelo:</label>
                    <input type="text" id="carModel" name="carModel" />
                </div>
                <div>
                    <label htmlFor="carBrand">Marca:</label>
                    <input type="text" id="carBrand" name="carBrand" />
                </div>
                <div>
                    <label htmlFor="carYear">Año:</label>
                    <input type="number" id="carYear" name="carYear" />
                </div>
                <button type="submit">Agregar Vehículo</button>
            </form>
        </div>
    );
};

export default CarAddPage;