<script>
	import Brand from "../shared/Brand.svelte"
	import Slider from "../shared/Slider.svelte"
	import Footer from "../shared/Footer.svelte"
	import Container from "../shared/Container.svelte"

    const images = [
        {
            src: "image/signin-slider-1.png",
            alt: "Slide 1"
        },
        // {
        //     src: "image/signin-slider-2.png",
        //     alt: "Slide 2"
        // }
    ]
</script>

<Container clazz="w-full flex items-center self-stretch">
    <div class="w-full md:w-[58%] flex flex-col items-center h-screen flex-1 self-stretch">
        <div class="flex flex-col justify-center items-center flex-1 self-stretch p-0 md:p-8">
            <div class="flex w-60 sm:w-72 lg:w-[368px] flex-col items-start gap-20">
                <Brand/>
                <slot />
            </div>
        </div>
        <Footer />
    </div>
    <div class="w-[42%] hidden md:block h-fit min-h-screen">
        <Slider {images} />
    </div>
</Container>
