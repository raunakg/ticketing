// import axios from 'axios';
// import BuildClient from "../api/build-client"
import Link from 'next/link'


const LandingPage = ({currentUser, tickets}) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key ={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href="/tickets/[ticketId]" as ={`/tickets/${ticket.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>
        )

    })



    return (
        <div>
            <h2>Tickets</h2>
            <table className="table">
                <thead>
                    <tr>
                        <td>Title</td>
                        <td>Price</td>
                        <td>Link</td>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    )
}

//useRequest hook can only be uused from react component

LandingPage.getInitialProps = async (context, client, currentUser) => {

    const { data } = await client.get('/api/tickets');

    return { tickets: data };
    
    // const client = BuildClient(context)
    

    // const { data } = await client.get('api/users/currentuser');
    // return data;


    // console.log(req.headers)
    // console.log('I am on the server!')

    // return {color: 'red'};

    // if(typeof window === 'undefined') {
    //     // we are on the server
    //     const { data } = await axios.get(
    //         'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
    //         {
    //             headers: req.headers
    //         }
    //     ).catch((err) => {
    //         console.log(err.message)
    //     });
    //     return data

    // } else {
    //     // we are on the server
    //     const { data } = await axios.get('/api/users/currentuser').catch((err) => {
    //         console.log(err.message)
    //     });
    //     return data
    // }

    // return {}


}

export default LandingPage;