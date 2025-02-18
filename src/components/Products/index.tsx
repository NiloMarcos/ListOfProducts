import { useEffect, useState } from "react";
import api from "../../services/api";
import Cart from "../../assets/icon-add-to-cart.svg";

interface ProductsProps {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
}

interface CartItem {
  title: string;
  quantity: number;
  price: number; 
}

export function Products() {
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [cartItems, setCartItems] = useState<{ [key: number]: CartItem }>(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);

      Object.keys(parsedCart).forEach((key) => {
        if (parsedCart[key].price === undefined) {
          parsedCart[key].price = 0;
        }
      });
      return parsedCart;
    }
    return {};
  });
  
  useEffect(() => {
    async function handleLoadingProducts() {
      try {
        const response = await api.get("/products");

        setProducts(response.data);
      } catch (error) {
        console.log("Ocorreu um erro ao carregar os produtos:", error);
      }
    }

    handleLoadingProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  
  const handleAddToCart = (id: number, title: string, price: number) => {
    setCartItems((prev) => {
      return { 
        ...prev, 
        [id]: { 
          title, 
          quantity: 1, 
          price
        } 
      };
    });
  };

  const handleIncrease = (id: number) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: { 
        ...prev[id],
        quantity: (prev[id]?.quantity || 0) + 1,
      },
    }));
  };

  const handleDecrease = (id: number) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[id].quantity > 1) {
        updatedCart[id] = {
          ...updatedCart[id],
          quantity: updatedCart[id].quantity - 1,
        };
      } else {
        delete updatedCart[id];
      }
      return updatedCart;
    });
  };

  return (
    <div className="w-[70%] max-md:w-full max-md:px-[20px]">
      <h1 className="text-[1.5rem] font-bold mb-[1.25rem]">Desserts</h1>

      <div className="grid grid-cols-3 gap-[30px] max-w-[1440px] mx-auto max-md:grid-cols-2">
        {products.map((item) => (
          <div key={item.id} className="flex flex-col items-center w-full">
            <img
              src={item.image}
              alt=""
              className={`w-full max-w-[250px] h-[200px] object-contain transition-all duration-300 ${
                cartItems[item.id] ? "border-[2px] border-[#C73A0F] rounded-md" : ""
              }`}
            />

            {cartItems[item.id] ? (
              <div className="flex items-center gap-2 border border-[#C73A0F] rounded-[50px] px-4 py-2 cursor-pointer relative top-[-30px] max-w-[150px] w-full justify-between bg-[#C73A0F]">
                <button
                  onClick={() => handleDecrease(item.id)}
                  className="text-[15px] text-white border border-[#FFF] pl-[7px] pr-[7px] rounded-[50%] cursor-pointer"
                >
                  -
                </button>
                <span className="text-[15px] text-white">{cartItems[item.id].quantity}</span>
                <button
                  onClick={() => handleIncrease(item.id)}
                  className="text-[15px] text-white border border-[#FFF] pl-[7px] pr-[7px] rounded-[50%] cursor-pointer"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddToCart(item.id, item.title, item.price)}
                className="flex items-center gap-[5px] border border-[#c4c4c4] rounded-[50px] bg-white p-[8px] cursor-pointer relative top-[-30px] max-md:text-[14px]"
              >
                <img src={Cart} alt="Icone de adicionar" />

                Add To Cart
              </button>
            )}

            <p className="w-full mb-[5px] capitalize max-md:text-[13px]">{item.category}</p>
            
            <p className="font-bold text-[15px] w-full truncate mb-[5px] max-md:text-[13px]">{item.title}</p>

            <p className="w-full text-[#C73A0F] font-semibold max-md:text-[13px]">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
