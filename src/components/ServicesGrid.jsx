import { NavLink } from "react-router-dom";

const categories = [
  {
    id: 1,
    title: "Women's Salon & Spa",
    img: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1678864013225-bfc1de.jpeg"
  },
  {
    id: 2,
    title: "Men's Salon & Massage",
    img: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1750845033589-98cdfb.jpeg"
  },
  {
    id: 3,
    title: "Cleaning & Pest Control",
    img: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1681711961404-75dfec.jpeg"
  },
  {
    id: 4,
    title: "Electrician, Plumber & Carpenter",
    img: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1658402794135-faf080.png"
  },
  {
    id: 5,
    title: "AC & Appliance Repair",
    img: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1751547558710-5ff49a.jpeg"
  },
  {
    id: 6,
    title: "Native Water Purifier",
    img: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1763734339268-efa6ea.jpeg"
  }
];

const services = [
  { id: 1, title: 'AC Service & Repair', price: 'From ₹499', time: '1 - 2 hrs', img: '/Static/AC_Reparing.jpg' },
  { id: 2, title: 'Home Cleaning',        price: 'From ₹299', time: '2 - 4 hrs', img: '/Static/House_Keeping.jpg' },
  { id: 3, title: 'Plumbing',             price: 'From ₹399', time: '1 - 3 hrs', img: '/Static/Plumbing.jpg' },
  { id: 4, title: 'Electrician',          price: 'From ₹199', time: '30 - 90 mins', img: '/Static/Electrician.jpg' },
];

export default function HomeServices() {
  return (
    <div className="w-full pt-20" >

      {/* ------------------ CATEGORIES SECTION ------------------ */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">
          Home services at your doorstep
        </h1>

        <div className="bg-white shadow-lg rounded-2xl p-6 border">
          <p className="text-lg font-semibold text-gray-600 mb-5">
            What are you looking for?
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 hover:shadow-md transition cursor-pointer"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-16 h-16 object-contain rounded-xl mb-2"
                />
                <p className="text-xs text-center">{c.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------ TOP SERVICES GRID ------------------ */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Top services</h3>
          <div className="text-sm text-gray-600">Showing top results near you</div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-md transition"
            >
              <img src={s.img} alt={s.title} className="w-full h-44 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{s.title}</h4>
                  <div className="text-sm text-gray-500">{s.time}</div>
                </div>

                <div className="mt-2 text-indigo-600 font-semibold">{s.price}</div>

                <div className="mt-4 flex justify-between gap-5">
                   <NavLink to="/providers">
                    <button className=" px-5 py-2 hover:cursor-pointer rounded-md bg-black text-white">
                    View details
                  </button>
                    </NavLink>
                  <NavLink to="/providers">
                    <button className="py-2 px-4  hover:cursor-pointer rounded-md bg-indigo-600 text-white ">
                    Book
                  </button>
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
