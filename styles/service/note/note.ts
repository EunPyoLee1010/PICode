import { makeStyles } from "@material-ui/styles";
import createStyles from "@material-ui/styles/createStyles";
import { IThemeStyle } from "../../theme";

export const noteStyle = makeStyles((theme: IThemeStyle) =>
    createStyles({
        root: {
            width: "100%",
            height: "100%",
            position: "relative",

            display: "flex",
            background: theme.backgroundColor.step1,
        },
        fileView: {
            width: "300px",
            height: "100%",
            display: "inline-block",
            background: theme.backgroundColor.step3,
        },
        content: {
            width: "calc(100% - 300px)",
            display: "inline-block",
            height: "100%",
            paddingTop: "24px",
        },
        leftTool: {
            width: "60px",
            display: "inline-block",
            height: "16px",
            visibility: "hidden",
            "&:hover": {
                visibility: "visible",
            },
        },
        write: {
            display: "inline-block",
            width: "calc(100% - 60px)",
            height: "fit-content",
        },
        title: {
            width: "100%",
            height: "230px",
            textAlign: "center",
        },
        titleContent: {
            height: "200px",
            width: "50%",
            display: "inline-block",
            textAlign: "left",
        },
        writeRoot: {
            width: "100%",
            height: "calc(100% - 230px)",
            textAlign: "center",
        },
        writeContent: {
            width: "calc(50% + 60px)",
            display: "inline-block",
            height: "100%",
            marginLeft: "-60px",
            cursor: "text",
        },
        defaultInput: {
            background: "inherit",
            border: "none",
            wordWrap: "break-word",
            wordBreak: "break-all",
            "&:focus": {
                border: "none",
                outline: "none",
            },
            resize: "none",
            overflowWrap: "break-word",
            width: "100%",
            fontSize: "14px",
            padding: "8px 0",
            boxSizing: "border-box",
        },
        h1Input: {
            fontSize: "28px",
            fontWeight: 700,
            padding: "18px 0",
        },
        h2Input: {
            fontSize: "21px",
            fontWeight: 700,
            padding: "17px 0",
        },
        h3Input: {
            fontSize: "16px",
            fontWeight: 700,
            padding: "16px 0",
        },
    })
);
