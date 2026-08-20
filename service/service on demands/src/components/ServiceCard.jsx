import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
    return (
        <div className="card service-card animate-fade-in flex flex-col h-full">
            <img src={service.image} alt={service.name} className="w-full h-[200px] object-cover" />
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-primary text-xs">{service.category}</span>
                    <span className="text-sm text-gray-600">
                        <i className="fa-solid fa-star text-amber-500"></i> {service.rating} ({service.reviews})
                    </span>
                </div>
                <h3 className="text-lg font-bold mb-2">
                    <Link to={`/services/${service.id}`} className="text-inherit hover:text-primary">
                        {service.name}
                    </Link>
                </h3>
                <div className="flex-1"></div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <span className="font-bold text-primary text-xl">₹{service.price}</span>
                    <Link to={`/services/${service.id}`} className="btn btn-primary py-2 px-4 text-sm">
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
