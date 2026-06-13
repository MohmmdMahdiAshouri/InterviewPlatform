import CountUp from "./Counter";

type state = {
    title: string,
    value: number,
}

function ProblemsState() {

    const stats: state[] = [
        {title: "کل تمرین ها", value: 50},
        {title: "تعداد تمرین های آسان", value: 20},
        {title: "تعداد تمرین های متوسط", value: 20},
        {title: "تعداد تمرین های سخت", value: 10},
    ]

    return (
        <div className="my-8">
            <div className="grid grid-cols-4 gap-x-4 stats_container">
                {
                    stats.map((stat, index) => (
                        <div key={index}>
                            <div>{stat.title}</div>
                            <CountUp from={0} to={stat.value}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ProblemsState;
