function VerifyPageHeader({phone}: {phone: string | undefined}) {
    return (
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">تایید شماره تلفن</h1>
            <p className="text-gray-400">
                کد ۶ رقمی ارسال شده به {phone} را وارد کنید
            </p>
        </div>
    );
}

export default VerifyPageHeader;
