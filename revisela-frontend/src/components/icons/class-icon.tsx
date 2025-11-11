import React from 'react';

interface ClassIconProps {
  className?: string;
}

const ClassIcon: React.FC<ClassIconProps> = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path d="M11.5 17.2554H7.125V17.62H11.5V17.2554Z" fill="currentColor" />
      <path d="M11.5 15.9793H7.125V16.3439H11.5V15.9793Z" fill="currentColor" />
      <path d="M11.5 18.5314H7.125V18.896H11.5V18.5314Z" fill="currentColor" />
      <path
        d="M17.125 17.2554H12.75V17.62H17.125V17.2554Z"
        fill="currentColor"
      />
      <path
        d="M17.125 15.9793H12.75V16.3439H17.125V15.9793Z"
        fill="currentColor"
      />
      <path
        d="M17.125 18.5314H12.75V18.896H17.125V18.5314Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.375 14.625H6.5V20.2502H18.375V14.625ZM5.875 14V20.8752H19V14H5.875Z"
        fill="currentColor"
      />
      <path
        d="M15.2938 24.0003C16.6582 24.0003 17.7644 22.881 17.7644 21.5002C17.7644 20.1195 16.6582 19.0001 15.2938 19.0001C13.9293 19.0001 12.8232 20.1195 12.8232 21.5002C12.8232 22.881 13.9293 24.0003 15.2938 24.0003Z"
        fill="currentColor"
      />
      <path
        d="M15.2938 24.8332C13.248 24.8355 11.5902 26.5131 11.5879 28.5833C11.5879 28.8135 11.7722 29 11.9997 29H18.5879C18.8153 29 18.9996 28.8135 18.9996 28.5833C18.9974 26.5131 17.3395 24.8355 15.2938 24.8332Z"
        fill="currentColor"
      />
      <path
        d="M7.7059 24.0003C9.0704 24.0003 10.1765 22.881 10.1765 21.5002C10.1765 20.1195 9.0704 19.0001 7.7059 19.0001C6.3414 19.0001 5.2353 20.1195 5.2353 21.5002C5.2353 22.881 6.3414 24.0003 7.7059 24.0003Z"
        fill="currentColor"
      />
      <path
        d="M7.7059 24.8332C5.6601 24.8355 4.0023 26.5131 4 28.5833C4 28.8135 4.1843 29 4.4118 29H11C11.2274 29 11.4118 28.8135 11.4118 28.5833C11.4095 26.5131 9.7517 24.8355 7.7059 24.8332Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ClassIcon;
