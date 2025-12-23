import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faClock,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';

const ContactPage = () => {
  const stores = [
    {
      id: 1,
      name: 'RẠCH GIÁ - NGUYỄN TRUNG TRỰC',
      isNew: true,
      image:
        'https://i.imgur.com/7Yz3Z7C.png', // thay bằng ảnh thật của bạn
      address:
        '247 Nguyễn Trung Trực, Phường Vĩnh Bảo, Rạch Giá, An Giang',
      time: '8:30 - 22:00',
      phone: '02871006789',
      mapUrl: 'https://maps.google.com',
    },
    {
      id: 2,
      name: 'ĐÀ NẴNG - LÊ DUẨN',
      image:
        'https://i.imgur.com/yA3Yp8z.png',
      address: '332 Đ. Lê Duẩn, Phường Thanh Khê, TP. Đà Nẵng',
      time: '8:30 - 22:00',
      phone: '02871006789',
      mapUrl: 'https://maps.google.com',
    },
    {
      id: 3,
      name: 'ĐẮK LẮK - BUÔN MA THUỘT',
      image:
        'https://i.imgur.com/5wZJHfA.png',
      address: '14 Phan Chu Trinh, Phường Buôn Ma Thuột, Đắk Lắk',
      time: '8:30 - 22:00',
      phone: '02871006789',
      mapUrl: 'https://maps.google.com',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-3">Thông tin liên hệ</h1>
        <p className="text-gray-700 leading-relaxed">
          Địa chỉ: 123 Đại học, Thành phố Hồ Chí Minh <br />
          Số điện thoại: 0123456789 <br />
          Email: daiphucduongvinh203@gmail.com
        </p>
      </div>

      <h2 className="text-xl font-bold mb-6">Hệ thống cửa hàng</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
           
            <div className="relative">
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-52 object-cover"
              />
              {store.isNew && (
                <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  New
                </span>
              )}
            </div>

           
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg">{store.name}</h3>

              <p className="text-sm text-gray-600 flex gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="mt-1" />
                {store.address}
              </p>

              <p className="text-sm text-gray-600 flex gap-2">
                <FontAwesomeIcon icon={faClock} className="mt-1" />
                {store.time}
              </p>

              <p className="text-sm text-gray-600 flex gap-2">
                <FontAwesomeIcon icon={faPhone} className="mt-1" />
                {store.phone}
              </p>

              <div className="pt-3">
                <a
                  href={store.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 !text-gray-400 rounded-lg text-sm hover:bg-gray-100"
                >
                  📍 Xem bản đồ
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactPage;
