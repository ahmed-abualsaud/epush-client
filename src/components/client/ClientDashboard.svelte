<script>
    import "../../app.css"

	import Main from "../shared/Main.svelte"
	import Async from "../shared/Async.svelte"
	import Header from "../shared/Header.svelte"
	import Footer from "../shared/Footer.svelte"
	import Sidebar from "../shared/Sidebar.svelte"
	import Container from "../shared/Container.svelte"

	import { getClient } from "../../api/clientApi"
    import { getLastOrder, listPaymentMethods } from "../../api/expenseApi"
    import { listSales, getClientSendersAndConnections } from "../../api/clientApi"
    import { setSales, setCurrentClient, setLastOrder, setPaymentMethods } from "$lib/helper/store"

	let client
    let lastOrder

    const loadClient = async () => {
        client = await getClient()
		client.connections = await getClientSendersAndConnections()

        lastOrder = await getLastOrder()
        lastOrder.number_of_messages = Math.floor(client.balance / lastOrder.pricelist.price)
		// client.balance = 0
        setCurrentClient(client)
        setLastOrder(lastOrder)
		setSales((await listSales()).map(sls => sls.name))
		setPaymentMethods((await listPaymentMethods()).map(payMtd => payMtd.name))
    }

    $: loadClient()
</script>


<Container clazz="h-fit min-h-screen flex items-start bg-secondary-900 w-screen">
	<Sidebar {client} {lastOrder} />

	<Main>
		<Header {client} {lastOrder} />

		<slot />

		<Footer />
	</Main>

</Container>

<Async alertClass="bottom-[3vh] left-[50vw] -translate-x-1/2"/>
