import { useEffect, useState } from "react";

import RemoveIcon from '../../assets/icon-remove-item.svg';

import CarbonIcon from '../../assets/icon-carbon-neutral.svg';
import { ModalConfirmOrder } from "../ModalConfirmOrder";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

export function Review() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
  
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
  
        const cartArray = Object.keys(parsedCart).map((key) => ({
          id: Number(key),
          title: parsedCart[key].title,
          quantity: parsedCart[key].quantity,
          price: parsedCart[key].price !== undefined ? parsedCart[key].price : 0,
        }));
  
        setCartItems(cartArray);
      } catch (error) {
        console.error("Failed to parse cart items from localStorage", error);
      }
    }
  }, [cartItems]);

  const handleRemove = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    
    const cartObj = updatedCart.reduce((acc, item) => {
      acc[item.id] = { title: item.title, quantity: item.quantity, price: item.price };
      return acc;
    }, {} as { [key: number]: { title: string; quantity: number; price: number } });
    
    localStorage.setItem("cartItems", JSON.stringify(cartObj));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  function handleConfirmOrder() {
    setIsVisible(true);
  }

  function handleCloseModal() {
    setIsVisible(false);
  }
  return (
    <div className="w-[30%] h-max bg-white shadow-lg rounded-lg p-5 max-md:w-[100%]">
      <h1 className="text-lg font-bold mb-4">Your Cart</h1>

      <div className="mt-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <div>
              <h2 className="font-semibold truncate max-w-[300px] max-md:text-[13px]">{item.title}</h2>
              <div className="flex items-center gap-[6px] max-md:gap-[5px]">
                <p className="font-semibold text-[#C73A0F] max-md:text-[13px]">{item.quantity}x</p>

                <p className="text-[14px] text-[##F4EDEB] max-md:text-[13px]">$ {item.price.toFixed(2)}</p>

                <p className="text-sm font-semibold text-gray-700 max-md:text-[13px]">
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            <div>
              <button 
                onClick={() => handleRemove(item.id)} 
                className="cursor-pointer border border-[#c4c4c4] p-[6px] rounded-[20px]"
              >
                <img src={RemoveIcon} alt="Icone de remover item" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="flex items-center justify-between text-[14px] font-medium mt-[40px]">
        Order Total
        <span className="text-[20px] font-bold max-md:text-[14px]">{`$${totalPrice.toFixed(2)}`}</span>
      </p>

      <p className="flex items-center justify-center mt-[30px] max-md:text-[14px]">
        <img src={CarbonIcon} alt="Carbon Icon" />

        This is a <strong className="pl-[3px] pr-[3px]">carbon-neutral</strong> delivery
      </p>

      <button className="w-full mt-[30px] bg-[#C73A0F] text-white py-2 rounded-[50px] h-[50px] cursor-pointer" onClick={handleConfirmOrder}>
        Confirm Order
      </button>
      
      {isVisible ? <ModalConfirmOrder handleCloseModal={handleCloseModal} /> : null}
    </div>
  );
}
