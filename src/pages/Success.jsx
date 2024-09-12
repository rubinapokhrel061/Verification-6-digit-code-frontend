import { IoMdCheckmarkCircle } from "react-icons/io";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-green-500 text-5xl font-bold mb-4">
        <IoMdCheckmarkCircle />
      </div>
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        Verification Successful !!!
      </h1>
    </div>
  );
};

export default Success;
