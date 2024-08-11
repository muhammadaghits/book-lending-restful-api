import memberService from "../service/member-service.js";

const createMember = async (req, res, next) => {
    try {
        const result = await memberService.createMember(req.body);
        res.status(201).json({
            data: result,
            message: "Member created successfully"
        });
    } catch (e) {
        next(e);
    }
}

const getMember = async (req, res, next) => {
    try {
        const result = await memberService.getMember();
        if (!result) {
            res.status(200).json({
                message: "Data is empty"
            });
        }
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const deleteMember = async (req, res, next) => {
    try {
        const memberId = req.params.memberId;

        await memberService.deleteMember(memberId);
        res.status(200).json({
            message: "Member deleted successfully"
        });
    } catch (e) {
        next(e);
    }
}

export default {
    createMember,
    getMember,
    deleteMember
}