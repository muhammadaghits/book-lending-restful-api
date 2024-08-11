import {validate} from "../validation/validation.js";
import {createMemberValidation, getMemberValidation} from "../validation/member-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";

const createMember = async (request) => {
    const member = validate(createMemberValidation, request);

    const countMember = await prismaClient.member.count({
       where: {
           code: member.code
       }
    });

    if (countMember === 1) {
        throw new ResponseError(400, "Member code already exist");
    }

    return prismaClient.member.create({
        data: member,
        select: {
            id: true,
            code: true,
            name: true,
            borrowedBook: true,
            returnDatePreviously: true,
            penalty: true
        }
    });
}

const getMember = async () => {
    return prismaClient.member.findMany({
        select: {
            id: true,
            code: true,
            name: true,
            borrowedBook: true,
            returnDatePreviously: true,
            penalty: true
        }
    });
}

const deleteMember = async (memberId) => {
    memberId = validate(getMemberValidation, memberId);

    const countMember = await prismaClient.member.count({
        where: {
            id: memberId,
            borrowedBook : 0
        }
    });

    if (countMember !== 1) {
        throw new ResponseError(404, "Member not found / Member must return book first");
    }

    return prismaClient.member.delete({
        where: {
            id: memberId
        }
    });
}

export default {
    createMember,
    getMember,
    deleteMember
}