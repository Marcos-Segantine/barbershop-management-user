import { Defs, Image, Path, Pattern, Svg, Use } from "react-native-svg"

export default InitialScreenSvg = () => {
    return(
        <Svg
        width={280}
        height={400}
        viewBox="0 0 284 466"
        fill="none"
        >
        <Path fill="url(#pattern0)" d="M0 0H284V466H0z" />
        <Defs>
            <Pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width={1}
            height={1}
            >
            <Use
                xlinkHref="#image0_7_1184"
                transform="matrix(.0004 0 0 .00024 -.32 0)"
            />
            </Pattern>
            <Image
            id="image0_7_1184"
            width={4096}
            height={4096}
            />
        </Defs>
    </Svg>
    )
}